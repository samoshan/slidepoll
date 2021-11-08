import { Button } from 'react-bulma-components'
import UserContext from '../../UserContext'
import LinkButton from './LinkButton'

export default function Header() {

  return <UserContext.Consumer>
    {({ user, logout }) => (
      <header>
      <div>
        <LinkButton to='/' >Home</LinkButton>
        { user && <LinkButton to='/mypolls' >My polls</LinkButton> }
      </div>
      { user ?
        <div>
          <p className='user-info'>Logged in as {user.firstName}</p>
          <Button color='dark' onClick={logout}>Logout</Button>
        </div>
      : <div>
          <p className='user-info'>Sign up now to create polls</p>
          <LinkButton to='/login' >Login</LinkButton>
          <LinkButton to='/signup' >Sign up</LinkButton>
        </div>
      }
      </header>
    )}
  </UserContext.Consumer>
}
