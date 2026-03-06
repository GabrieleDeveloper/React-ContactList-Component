import { useEffect, useRef, useState } from 'react';
import styles from './contactForm.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserPlus, faLock, faClose, faCircleCheck} from '@fortawesome/free-solid-svg-icons'

import { createTimeline } from 'animejs'
import { motion } from 'framer-motion'

function ContactForm({ 
        contactFormVisible, 
        dialogFullContactsVisible, 
        newUser, setNewUser, 
        emptyFormFields, setEmptyFormFields, 
        usersList, 
        filters, setFilters, 
        setUsersList, 
        detectJobColor, 
        resetFormState

    }) {

    const [dialogNewUserCheckedVisible, setDialogNewUserCheckedVisible] = useState(true);

    const footerButtonRef = useRef(null);
    const buttonClickTimeLineRef = useRef(null);


    // Function to select only 1 job-filter while creating a newUser
    const toggleFilterNewUser = (id) => {
        let jobSelected = filters.filter((f) => f.id === id);
        if(jobSelected[0].active === true){
            jobSelected = null;
        }
        else{
            jobSelected = jobSelected[0].label;
        }

        setFilters(prev => 
            prev.map(f => 
                f.id === id ? { ...f, active: !f.active } : {...f, active: false}
            )
        )
        setNewUser({...newUser, job: jobSelected});

    }


    // Function to verify the validity of the fields and highlight the invalid ones
    const validateForm = () => {
        buttonClickTimeLineRef.current.play();
        let emptyFormFields = [];
        if(newUser.name === null || newUser.name === ''){
            emptyFormFields = [...emptyFormFields, 'name'];
        }
        if(newUser.surname === null || newUser.surname === ''){
            emptyFormFields = [...emptyFormFields, 'surname'];
        }
        if(newUser.job === null || newUser.job === ''){
            emptyFormFields = [...emptyFormFields, 'job'];
        }

        if(emptyFormFields.length === 0){
            setEmptyFormFields([...emptyFormFields]);
            setNewUser({ id: null, name: '', surname: '', job: '', active: 'true' })
            setUsersList([...usersList, {...newUser, id: usersList.length !== 0 ? (usersList[usersList.length - 1].id + 1) : 0}]);
            resetFormState();
            setDialogNewUserCheckedVisible(true)
        }
        else{
            setEmptyFormFields([...emptyFormFields]);
        }
        buttonClickTimeLineRef.current.restart();
    }


    // Timer to hide the screen "Registered User!" after 1s
    useEffect(() => {
        const timer = setTimeout(() => {
            setDialogNewUserCheckedVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    },[dialogNewUserCheckedVisible])


    // To Assegnate to buttonClickTimeLineRef the value to operate (Play - Stop)
    useEffect(() => {
        buttonClickTimeLineRef.current = createTimeline({ autoplay: false, defaults: { duration: 300, easing: 'easeOutExpo' }})
        .add( footerButtonRef.current, { scale: 0.95 })
        .add( footerButtonRef.current, { scale: 1 }, 150);
    },[])


  return (
    <>
        <section className={styles.listComponent_newUserCheckedDialog} style={{ opacity: dialogNewUserCheckedVisible ? 1 : 0, transition: '0.4s ease-in-out', zIndex: dialogNewUserCheckedVisible ? 90 : -100 }}>
            <div className={styles.listComponent_newUserCheckedDialog_container}>
                <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '70px', color: '#050505' }} />
                <h3 className={styles.listComponent_newUserCheckedDialog_container_text}>Utente registrato!</h3>
            </div>
        </section>

        <section className={styles.listComponent_dialogNewUser}
            style={{
                zIndex: contactFormVisible ? '100' : '-1',
                transition: '0.5s ease',
                top: contactFormVisible ? '0px' : '-450px'
            }}>
            {
                dialogFullContactsVisible ?
                    <section className={styles.dialogFullContacts}>
                        <FontAwesomeIcon icon={faLock} style={{ fontSize: '70px', color: '#e63946' }} />
                        <h3 className={styles.dialogFullContacts_title}>Massimo 6 Contatti</h3>
                        <h3 className={styles.dialogFullContacts_description}>Eliminare contatti per inserirne altri!</h3>
                    </section>
                :
                <>
                    <header className={styles.listComponent_dialogNewUser_header}>
                        <div className={styles.listComponent_dialogNewUser_header_container}>
                            <FontAwesomeIcon icon={faUserPlus} style={{color: '#262626', fontSize: '20px'}} />
                            <h1 className={styles.listComponent_dialogNewUser_header_container_title}>Nuovo Contatto</h1>
                        </div>
                    </header>

                    <section className={styles.listComponent_dialogNewUser_body}>

                        <fieldset className={styles.listComponent_dialogNewUser_body_inputs}>
                            <label className={styles.listComponent_dialogNewUser_body_inputs_inputContainer}>
                                <h3 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_tag} 
                                    style={
                                        emptyFormFields?.includes('name') ? 
                                        { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}
                                    >Nome
                                </h3>
                                <input 
                                    type="text" 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_input} 
                                    onChange={(e) => { setNewUser({...newUser, name: e.target.value}) }} 
                                    style={emptyFormFields?.includes('name') ? { border: '1px solid #e63946', backgroundColor: '#ffe5e5', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}
                                    value={newUser.name}
                                />
                            </label>
                            <label className={styles.listComponent_dialogNewUser_body_inputs_inputContainer}>
                                <h3 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_tag} 
                                    style={
                                        emptyFormFields?.includes('surname') ? 
                                        { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}
                                    >Cognome
                                    </h3>
                                <input 
                                    type="text" 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_input} 
                                    onChange={(e) => { setNewUser({...newUser, surname: e.target.value}) }} 
                                    style={emptyFormFields?.includes('surname') ? { border: '1px solid #e63946', backgroundColor: '#ffe5e5', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}} 
                                    value={newUser.surname}
                                />
                            </label>
                        </fieldset>

                        <div className={styles.listComponent_dialogNewUser_body_textContainer}>
                            <h3 className={styles.listComponent_dialogNewUser_body_textContainer_label} style={emptyFormFields?.includes('job') ? { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}>Lavoro</h3>
                            <h3 className={styles.listComponent_dialogNewUser_body_textContainer_warningText} style={emptyFormFields?.includes('job') ? { opacity: 1, transition: '0.2s ease-in-out' } : {opacity: 0,transition: '0.2s ease-in-out'}}>*Seleziona un lavoro*</h3>
                        </div>

                        <div className={styles.listComponent_dialogNewUser_body_chooseJob}>
                            <ul className={styles.listComponent_header_filter} style={{ alignItems: 'center' }}>
                                {filters.map((filter) => {
                                    return(
                                        <motion.li className={filter.active ? styles.listComponent_header_filter_jobContainer_active : styles.listComponent_header_filter_jobContainer}
                                            style={{ backgroundColor: detectJobColor(filter.label).background }}
                                            onClick={() => toggleFilterNewUser(filter.id)}
                                            layout
                                            transition={{ type: "spring", duration: 0.8, ease: "easeInOut" }}
                                            key={filter.id}
                                        >
                                            <FontAwesomeIcon icon={faClose} 
                                                style={{ opacity: filter.active ? '1' : '0',transition: '0.2s ease', position: 'absolute', left: '10px', color: '#f3f3f3' }} 
                                            />
                                            <h3 className={styles.listComponent_header_filter_text} style={{ color: filter.active ? '#f3f3f3' : detectJobColor(filter.label).text }}>{filter.label}</h3>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>

                    </section>
                    <footer className={styles.listComponent_dialogNewUser_footer}>
                        <button className={styles.listComponent_dialogNewUser_footer_button} onClick={validateForm} ref={footerButtonRef}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px', fontSize: '22px', color: '#f3f3f3' }} />
                            <h3 className={styles.listComponent_dialogNewUser_footer_button_text}>
                                Crea Contatto
                            </h3>
                        </button>
                    </footer>
                </>
            }
        </section>
    </>
  )
}

export default ContactForm
