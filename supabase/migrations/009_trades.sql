-- Trades table: tracks confirmed sticker exchanges
CREATE TABLE IF NOT EXISTS public.trades (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id         uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  initiator_id    uuid REFERENCES auth.users(id) NOT NULL,
  partner_id      uuid REFERENCES auth.users(id) NOT NULL,
  status          text NOT NULL DEFAULT 'pending', -- 'pending' | 'completed' | 'cancelled'
  confirmed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chat_id)
);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "trade_participants" ON public.trades;
CREATE POLICY "trade_participants" ON public.trades
  FOR ALL TO authenticated
  USING (initiator_id = auth.uid() OR partner_id = auth.uid());

-- Trigger: trade completed → notification for both users
CREATE OR REPLACE FUNCTION public.notify_trade_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_init_user text;
  v_part_user text;
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    SELECT username INTO v_init_user FROM public.profiles WHERE id = NEW.initiator_id;
    SELECT username INTO v_part_user FROM public.profiles WHERE id = NEW.partner_id;

    INSERT INTO public.notifications(user_id, type, title, data)
    VALUES
      (NEW.initiator_id, 'trade_completed',
       'Troca com @' || v_part_user || ' confirmada!',
       jsonb_build_object('chat_id', NEW.chat_id, 'trade_id', NEW.id, 'other_username', v_part_user)),
      (NEW.partner_id, 'trade_completed',
       'Troca com @' || v_init_user || ' confirmada!',
       jsonb_build_object('chat_id', NEW.chat_id, 'trade_id', NEW.id, 'other_username', v_init_user));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_trade ON public.trades;
CREATE TRIGGER trg_notify_trade
  AFTER UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_trade_completed();
