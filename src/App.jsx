import styles from './app.module.scss'
import ContactList from './components/ContactList'

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.header_title}>Contact List Component</h1>
        <h3 className={styles.header_subtitle}>Interact with the component to explore its behavior <br />band UI interactions!</h3>
      </header>
      <main className={styles.body}>
        <ContactList/>
      </main>
      <footer className={styles.footer}>
        <h6 className={styles.footer_description}>Designed and developed by Gabriele Conti with React.</h6>
      </footer>
    </div>
  )
}

export default App
