-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        text NOT NULL, -- 'new_message' | 'trade_completed' | 'new_rating'
  title       text NOT NULL,
  body        text,
  data        jsonb,
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_notifications" ON public.notifications;
CREATE POLICY "own_notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Trigger: new message → notification for recipient
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_other_id uuid;
  v_username text;
BEGIN
  SELECT CASE WHEN c.user1_id = NEW.sender_id THEN c.user2_id ELSE c.user1_id END
    INTO v_other_id
    FROM public.chats c
   WHERE c.id = NEW.chat_id;

  SELECT username INTO v_username FROM public.profiles WHERE id = NEW.sender_id;

  INSERT INTO public.notifications(user_id, type, title, body, data)
  VALUES (
    v_other_id,
    'new_message',
    '@' || v_username || ' enviou uma mensagem',
    LEFT(NEW.content, 80),
    jsonb_build_object('chat_id', NEW.chat_id, 'from_username', v_username)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_message ON public.messages;
CREATE TRIGGER trg_notify_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  WHEN (NEW.message_type = 'text' OR NEW.message_type IS NULL)
  EXECUTE FUNCTION public.notify_new_message();

-- Trigger: new rating → notification for rated user
CREATE OR REPLACE FUNCTION public.notify_new_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_username text;
BEGIN
  SELECT username INTO v_username FROM public.profiles WHERE id = NEW.rater_id;
  INSERT INTO public.notifications(user_id, type, title, data)
  VALUES (
    NEW.rated_id,
    'new_rating',
    '@' || v_username || ' avaliou você',
    jsonb_build_object('from_username', v_username, 'score', NEW.score)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_rating ON public.ratings;
CREATE TRIGGER trg_notify_rating
  AFTER INSERT ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_rating();
