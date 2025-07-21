import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { api } from "libs";
import { useEffect } from "react";
import { createAuthClient } from "better-auth/react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  useEffect(() => {
    console.log(api.ping.get());
  }, []);
  return (
    <div className="text-center">
      <button
        type="button"
        className="p-4 rounded-md"
        onClick={() => {
          const client = createAuthClient({
            baseURL: "http://localhost:3000",
          })

          client.signIn.social({
            provider: "google",
            
          })
        }}
      >
        Signin with google
      </button>
    </div>
  );
}
