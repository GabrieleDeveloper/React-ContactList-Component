import styles from './App.module.scss'
import ContactList from './components/ContactList'

function App() {
  return (
    <div className={styles.container}>
      <ContactList/>
    </div>
  )
}

export default App
