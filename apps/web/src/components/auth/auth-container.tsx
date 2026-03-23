import LoginContainer from './login-container'
import RegisterContainer from './register-container'

type AuthContainerProps = {
  type: 'login' | 'register'
}

const AuthContainer = ({ type }: AuthContainerProps) => {
  return (
    <section className="w-full h-auto flex flex-col items-center gap-4">
      <img src="/logo.png" alt="Real Estate CRM Logo" className="w-32 h-auto" />
      {type === 'login' ? <LoginContainer /> : <RegisterContainer />}
    </section>
  )
}

export default AuthContainer
