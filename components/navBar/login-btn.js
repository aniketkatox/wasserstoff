import { useSession, signIn, signOut } from "next-auth/react"

export default function LogInLogOut() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div id="signOut">
        {session.user.email}
        <button className="border-m-violet-50" onClick={() => signOut()}>
            <pre> | Sign out </pre>
        </button>
      </div>
    )
  }
  return (
    <div id="signIn">
      <button onClick={() => signIn('google')}>Sign in</button>
    </div>
  )
}