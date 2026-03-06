import { useEffect, useState } from 'react'
import styles from './contactList.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faTrashCan, faClose } from '@fortawesome/free-solid-svg-icons'

import { motion } from 'framer-motion'
import users from '../assets/data/contacts.json'
import ContactForm from './ContactForm'

function ContactList() {
    const [usersList, setUsersList] = useState(users);
    const [filteredUsersList, setFilteredUsersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [contactFormVisible, setContactFormVisible] = useState(false);
    const [newUser, setNewUser] = useState({ id: null, name: '', surname: '', job: '', active: 'true' });
    const [emptyFormFields, setEmptyFormFields] = useState([]);
    const [dialogFullContactsVisible, setDialogFullContactsVisible] = useState(true);

    const [userSelected, setUserSelected] = useState('');

    const [filters, setFilters] = useState([
        {id: 1, label: 'Programmer', active: false},
        {id: 2, label: 'Manager', active: false},
        {id: 3, label: 'Lawyer', active: false}
    ]);


    //Function to Filter users base on selected tags
    const toggleFilterSearch = (id) => {
        setFilters(prev => 
            prev.map(f => 
                f.id === id ? { ...f, active: !f.active } : f
            )
        )
    }

    //Function to order and separate ACTIVE filters to UNACTIVE ones
    const orderFilters = [
        ...filters.filter(f => f.active),
        ...filters.filter(f => !f.active)
    ];


    //To assegnate colors to the job tags
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


    // Function to reset all states once the form is opened or closed
    const resetFormState = () => {
        setContactFormVisible(!contactFormVisible);

        setNewUser({ id: null, name: '', surname: '', job: '', active: 'true' })
        setEmptyFormFields([]);
        setFilters(prevFilters => 
            prevFilters.map(f => ({ ...f, active: false }))
        );
        
    }



    // Verify if the contacts are more than 6
    useEffect(() => {
        if(usersList.length >= 6){
            setDialogFullContactsVisible(true);
        }
        else{
            setDialogFullContactsVisible(false);
        }
    },[usersList])


    // Filter the users by searching and filtering
    useEffect(() => {
        let result = [...usersList];
        if(searchTerm.trim() !== ''){
            result = result.filter((user) => {
                let userCompleteName = `${user.name} ${user.surname}`;
                return userCompleteName.toLowerCase().includes(searchTerm.toLowerCase())
            }
            );
        }

        const activeFilters = filters.filter(f => f.active).map(f => f.label);
        if(activeFilters.length > 0) {
            result = result.filter(user => activeFilters.includes(user.job));
        }

        setFilteredUsersList(result);
    },[filters, searchTerm, usersList])

  return (
    <section className={styles.listComponentContainer}>
        <ContactForm
            contactFormVisible={contactFormVisible}
            dialogFullContactsVisible={dialogFullContactsVisible}
            newUser={newUser}
            setNewUser={setNewUser}
            emptyFormFields={emptyFormFields}
            setEmptyFormFields={setEmptyFormFields}
            usersList={usersList}
            filters={filters}
            setFilters={setFilters}
            setUsersList={setUsersList}
            detectJobColor={detectJobColor}
            resetFormState={resetFormState}
        />

        <button onClick={resetFormState}>
            <FontAwesomeIcon 
                icon={faPlus} 
                style={{ 
                    position: 'absolute', 
                    color: '#545454', 
                    top: '25px', 
                    right: '20px', 
                    fontSize: '25px', 
                    cursor: 'pointer',
                    zIndex: '101',
                    rotate: contactFormVisible ? '135deg' : '0deg',
                    transition: '0.25s linear'
                }}
            />
        </button>
            <div className={styles.contentLayer}>
                <header className={styles.listComponent_header}>
                    <h1 className={styles.listComponent_header_title}>Contatti</h1>
                    <p className={styles.listComponent_header_subtitle}>{usersList.length} Contatti</p>
                    <div className={styles.listComponent_header_searchBar}>
                        <div className={styles.listComponent_header_searchBar_iconBox}>
                            <FontAwesomeIcon icon={faSearch}color='#888888' style={{ fontSize: '22px' }} />
                        </div>
                        <input className={styles.listComponent_header_searchBar_inputText} placeholder='Cerca...' onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <ul className={styles.listComponent_header_filter}>
                        {orderFilters.map((filter) => {
                            return(
                                <motion.li className={filter.active ? styles.listComponent_header_filter_jobContainer_active : styles.listComponent_header_filter_jobContainer}
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
                                </motion.li>
                            );
                        })}
                    </ul>
                </header>
                <section className={styles.listComponent_body}>
                    {filteredUsersList.length !== 0 ?
                    
                        <ul className={styles.listComponent_body_ul}>
                            {filteredUsersList.map((user) => {
                                return(
                                    <li className={styles.listComponent_body_userBox} onClick={() => setUserSelected(user.id !== userSelected ? user.id : '')} key={user.id}>
                                        <div className={styles.listComponent_body_userBox_activeUser}>
                                            <div className={styles.listComponent_body_userBox_activeUser_dot}
                                                style={{ backgroundColor: user.active ? '#1dca1d' : '#ca1d1d' }}
                                            ></div>
                                        </div>
                                        <div className={styles.listComponent_body_userBox_userName}>{user.name + ' ' + user.surname}</div>
                                        <div className={styles.listComponent_body_userBox_userJob} style={{backgroundColor: detectJobColor(user.job).background, color: detectJobColor(user.job).text, right: userSelected === user.id ? '48.5px' : '15px', transition: '0.3s ease-in-out' }}>{user.job}</div>
                                        <div 
                                            className={styles.listComponent_body_userBox_deleteUserContainer} 
                                            style={{ width: userSelected === user.id ? '26.5px' : '0px', transition: '0.2s ease-in-out', right: userSelected === user.id ? '15px':'20px' }} 
                                            onClick={() => setUsersList(prevUsers => prevUsers.filter(pv => pv.id !== user.id))}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} style={{color: userSelected === user.id ? '#f3f3f3' : '#f4f4f4', fontSize: '12px' }} />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        
                        :

                        <p className={styles.noContactsText}>Nessun Contatto</p>
                    }
                </section>
            </div>
    </section>
  )
}

export default ContactList
