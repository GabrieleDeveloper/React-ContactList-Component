
import { useEffect, useState, useRef } from 'react'
import styles from './contactList.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faUserPlus, faLock, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { createTimeline } from 'animejs'

import { motion } from 'framer-motion'

function ContactList() {
    const users = [
        {
            id: 1,
            name: 'Marco',
            surname: 'Rossi',
            job: 'Programmer',
            active: true,
        },
        {
            id: 2,
            name: 'Luca',
            surname: 'Collesi',
            job: 'Manager',
            active: true,
        },
        {
            id: 3,
            name: 'Davide',
            surname: 'Salvatore',
            job: 'Lawyer',
            active: false,
        },
    ];

    const [newUser, setNewUser] = useState({ id: null, name: '', surname: '', job: '', active: 'true' });
    const [emptyFields, setEmptyFields] = useState([]);

    const [usersList, setUsersList] = useState(users);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDialogNewUserChecked, setActiveDialogNewUserChecked] = useState(true);

    const [dialogNewUserVisible, setDialogNewUserVisible] = useState(false);
    const [dialogFullContacts, setDialogFullContacts] = useState(true);

    const [userClicked, setUserClicked] = useState('');
    const [, forceUpdate] = useState(0);

    const [filters, setFilters] = useState([
        {id: 1, label: 'Programmer', active: false},
        {id: 2, label: 'Manager', active: false},
        {id: 3, label: 'Lawyer', active: false}
    ]);


    const footerButtonRef = useRef(null);
    const buttonClickTimeLineRef = useRef(null);

    const toggleFilterSearch = (id) => {
        setFilters(prev => 
            prev.map(f => 
                f.id === id ? { ...f, active: !f.active } : f
            )
        )
    }

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

    const orderFilters = [
        ...filters.filter(f => f.active),
        ...filters.filter(f => !f.active)
    ];

    const detectJobColor = (job) => {
        if(job === 'Programmer'){
            return {text: '#F97316', background: '#FFD7BC'};
        }
        else if(job === 'Manager'){
            return {text: '#EF4444', background: '#FFCCCC'};
        }
        else if(job === 'Lawyer'){
            return {text: '#7B1E3A', background: '#F8C0D1'};
        }
    }

    useEffect(() => {
        if(usersList.length >= 6){
            setDialogFullContacts(true);
        }
        else{
            setDialogFullContacts(false);
        }
    },[usersList])

    useEffect(() => {
        
        buttonClickTimeLineRef.current = createTimeline({ autoplay: false, defaults: { duration: 300, easing: 'easeOutExpo' }})
        .add( footerButtonRef.current, { scale: 0.95 })
        .add( footerButtonRef.current, { scale: 1 }, 150);
    },[])

    useEffect(() => {
        let result = [...usersList];
        if(searchTerm.trim() !== ''){ //Tolgo spazi bianchi 
            result = result.filter((user) => {
                let userCompleteName = user.name + user.surname;
                return userCompleteName.toLowerCase().includes(searchTerm.toLowerCase())
            }
            );
        }

        const activeFilters = filters.filter(f => f.active).map(f => f.label);
        if(activeFilters.length > 0) {
            result = result.filter(user => activeFilters.includes(user.job));
        }

        setFilteredUsers(result);
    },[filters, searchTerm, usersList])

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveDialogNewUserChecked(false);
        }, 1000);

        return () => clearTimeout(timer);
    },[activeDialogNewUserChecked])


    //Funzione per verificare la validità dei campi e raccogliere quelli non validi per evidenziarli
    const validateForm = () => {
        buttonClickTimeLineRef.current.play();
        let emptyFields = [];
        if(newUser.name === null || newUser.name === ''){
            emptyFields = [...emptyFields, 'name'];
        }
        if(newUser.surname === null || newUser.surname === ''){
            emptyFields = [...emptyFields, 'surname'];
        }
        if(newUser.job === null || newUser.job === ''){
            emptyFields = [...emptyFields, 'job'];
        }

        if(emptyFields.length === 0){
            setEmptyFields([...emptyFields]);
            setNewUser({ id: null, name: '', surname: '', job: '', active: 'true' })
            setUsersList([...usersList, {...newUser, id: usersList[usersList.length - 1].id + 1 }]);
            openCloseDialog();
            setActiveDialogNewUserChecked(true)
        }
        else{
            setEmptyFields([...emptyFields]);
        }
        buttonClickTimeLineRef.current.restart();
    }

    //Funzione per sistemare tutti gli state quando sia apre e si chiude la dialog
    const openCloseDialog = () => {
        setDialogNewUserVisible(!dialogNewUserVisible) 
        setNewUser({ id: null, name: '', surname: '', job: '', active: 'true' })
        setEmptyFields([]);

        setFilters(prevFilters => 
            prevFilters.map(f => ({ ...f, active: false }))
        );
        
    }

    const deleteUser = (id) => {
        setUsersList(prevUsers => prevUsers.filter(pv => pv.id !== id));
    }

    const handleSetUserClicked = (id) => {
        if(id !== userClicked){
            setUserClicked(id);
        }
        else{
            setUserClicked('');
        }
    }

  return (
    <div className={styles.listComponentContainer}>


        <div className={styles.listComponent_dialogNewUser}
            style={{
                zIndex: dialogNewUserVisible ? '100' : '-1',
                transition: '0.5s ease',
                top: dialogNewUserVisible ? '0px' : '-450px'
            }}>
            {
                dialogFullContacts ?
                    <div className={styles.dialogFullContacts}>
                        <FontAwesomeIcon icon={faLock} style={{ fontSize: '70px', color: '#e63946' }} />
                        <h3 className={styles.dialogFullContacts_title}>Massimo 6 Utenti</h3>
                        <h3 className={styles.dialogFullContacts_description}>Eliminare utenti per inserirne altri!</h3>
                    </div>
                :
                <>
                    <div className={styles.listComponent_dialogNewUser_header}>
                        <div className={styles.listComponent_dialogNewUser_header_container}>
                            <FontAwesomeIcon icon={faUserPlus} style={{color: '#262626', fontSize: '20px'}} />
                            <h1 className={styles.listComponent_dialogNewUser_header_container_title}>Nuovo Contatto</h1>
                        </div>
                    </div>
                    <div className={styles.listComponent_dialogNewUser_body}>
                        <div className={styles.listComponent_dialogNewUser_body_inputs}>
                            <div className={styles.listComponent_dialogNewUser_body_inputs_inputContainer}>
                                <h3 className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_tag} style={emptyFields?.includes('name') ? { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}>Nome</h3>
                                <input 
                                    type="text" 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_input} 
                                    onChange={(e) => { setNewUser({...newUser, name: e.target.value}) }} 
                                    style={emptyFields?.includes('name') ? { border: '1px solid #e63946', backgroundColor: '#ffe5e5', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}
                                    value={newUser.name}
                                />
                            </div>
                            <div className={styles.listComponent_dialogNewUser_body_inputs_inputContainer}>
                                <h3 className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_tag} style={emptyFields?.includes('surname') ? { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}>Cognome</h3>
                                <input 
                                    type="text" 
                                    className={styles.listComponent_dialogNewUser_body_inputs_inputContainer_input} 
                                    onChange={(e) => { setNewUser({...newUser, surname: e.target.value}) }} 
                                    style={emptyFields?.includes('surname') ? { border: '1px solid #e63946', backgroundColor: '#ffe5e5', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}} 
                                    value={newUser.surname}
                                />
                            </div>
                        </div>
                        <div className={styles.listComponent_dialogNewUser_body_textContainer}>
                            <h3 className={styles.listComponent_dialogNewUser_body_textContainer_label} style={emptyFields?.includes('job') ? { color: '#e63946', transition: '0.2s ease-in-out' } : {transition: '0.2s ease-in-out'}}>Lavoro</h3>
                            <h3 className={styles.listComponent_dialogNewUser_body_textContainer_warningText} style={emptyFields?.includes('job') ? { opacity: 1, transition: '0.2s ease-in-out' } : {opacity: 0,transition: '0.2s ease-in-out'}}>*Seleziona un lavoro*</h3>
                        </div>
                        <div className={styles.listComponent_dialogNewUser_body_chooseJob}>
                            <div className={styles.listComponent_header_filter} style={{ alignItems: 'center' }}>
                                {filters.map((filter) => {
                                    return(
                                        <motion.div className={filter.active ? styles.listComponent_header_filter_jobContainer_active : styles.listComponent_header_filter_jobContainer}
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
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={styles.listComponent_dialogNewUser_footer}>
                        <div className={styles.listComponent_dialogNewUser_footer_button} onClick={validateForm} ref={footerButtonRef}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px', fontSize: '22px', color: '#f3f3f3' }} />
                            <h3 className={styles.listComponent_dialogNewUser_footer_button_text}>
                                Crea Contatto
                            </h3>
                        </div>
                    </div>
                </>
            }
        </div>

        <FontAwesomeIcon icon={faPlus} 
            onClick={openCloseDialog}
            style={{ 
                position: 'absolute', 
                color: '#545454', 
                top: '25px', 
                right: '20px', 
                fontSize: '25px', 
                cursor: 'pointer',
                zIndex: '101',
                rotate: dialogNewUserVisible ? '135deg' : '0deg',
                transition: '0.25s linear'
            }}
        />
            <div className={styles.listComponent_newUserCheckedDialog} style={{ opacity: activeDialogNewUserChecked ? 1 : 0, transition: '0.4s ease-in-out', zIndex: activeDialogNewUserChecked ? 90 : -100 }}>
                <div className={styles.listComponent_newUserCheckedDialog_container}>
                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '70px', color: '#050505' }} />
                    <h3 className={styles.listComponent_newUserCheckedDialog_container_text}>Utente registrato!</h3>
                </div>
            </div>
            <div style={{ zIndex: 10 }}>
                <div className={styles.listComponent_header}>
                    <h1 className={styles.listComponent_header_title}>Contatti</h1>
                    <h2 className={styles.listComponent_header_subtitle}>{usersList.length} Contatti</h2>
                    <div className={styles.listComponent_header_searchBar}>
                        <div className={styles.listComponent_header_searchBar_iconBox}>
                            <FontAwesomeIcon icon={faSearch}color='#888888' style={{ fontSize: '22px' }} />
                        </div>
                        <input className={styles.listComponent_header_searchBar_inputText} placeholder='Cerca...' onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className={styles.listComponent_header_filter}>
                        {orderFilters.map((filter) => {
                            return(
                                <motion.div className={filter.active ? styles.listComponent_header_filter_jobContainer_active : styles.listComponent_header_filter_jobContainer}
                                    style={{ backgroundColor: detectJobColor(filter.label).background }}
                                    onClick={() => toggleFilterSearch(filter.id)}
                                    layout
                                    transition={{ type: "spring", duration: 0.8, ease: "easeInOut" }}
                                    key={filter.id}
                                >
                                    <FontAwesomeIcon icon={faClose} 
                                        style={{ opacity: filter.active ? '1' : '0',transition: '0.2s ease', position: 'absolute', left: '10px', color: '#f3f3f3' }} 
                                    />
                                    <h3 className={styles.listComponent_header_filter_text} style={{ color: filter.active ? '#f3f3f3' : detectJobColor(filter.label).text }} >{filter.label}</h3>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.listComponent_body}>
                    {filteredUsers.map((user, key) => {
                        return(
                            <div className={styles.listComponent_body_userBox} onClick={() => handleSetUserClicked(user.id)} key={key}>
                                <div className={styles.listComponent_body_userBox_activeUser}>
                                    <div className={styles.listComponent_body_userBox_activeUser_dot}
                                        style={{ backgroundColor: user.active ? '#1dca1d' : '#ca1d1d' }}
                                    ></div>
                                </div>
                                <div className={styles.listComponent_body_userBox_userName}>{user.name + ' ' + user.surname}</div>
                                <div className={styles.listComponent_body_userBox_userJob} style={{backgroundColor: detectJobColor(user.job).background, color: detectJobColor(user.job).text, right: userClicked === user.id ? '48.5px' : '15px', transition: '0.3s ease-in-out' }}>{user.job}</div>
                                <div 
                                    className={styles.listComponent_body_userBox_deleteUserContainer} 
                                    style={{ width: userClicked === user.id ? '26.5px' : '0px', transition: '0.2s ease-in-out', right: userClicked === user.id ? '15px':'20px' }} 
                                    onClick={() => deleteUser(user.id)}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} style={{color: userClicked === user.id ? '#f3f3f3' : '#f4f4f4', fontSize: '12px' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    </div>
  )
}

export default ContactList
