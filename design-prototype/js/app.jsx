function App() {
  const [screen,    setScreen]    = React.useState("album");
  const [onboarded, setOnboarded] = React.useState(true);

  if (!onboarded) {
    return <OnboardingScreen onDone={() => setOnboarded(true)}/>;
  }

  return (
    <div className="ta-app">
      <Sidebar current={screen} onNav={setScreen}/>
      <main className="ta-main">
        <div className="ta-main-inner">
          {screen === "album"   && <AlbumScreen   goto={setScreen}/>}
          {screen === "matches" && <MatchesScreen goto={setScreen}/>}
          {screen === "chat"    && <ChatScreen/>}
          {screen === "profile" && <ProfileScreen/>}
        </div>
      </main>
      <button
        className="ta-debug-onb"
        onClick={() => setOnboarded(false)}
        title="Ver onboarding"
      >
        Reabrir onboarding
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
