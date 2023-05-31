import React from 'react'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import styles from './Navbar.module.css'

const Navbar = () => {

    return (
        <Nav justify variant="tabs">
            <Nav.Item>
                <Nav.Link as={Link} to="/" className={styles.link}> Inicial </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/alunos" className={styles.link}> Alunos </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/professores" className={styles.link}> Professores </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="disciplinas" className={styles.link}> Disciplinas </Nav.Link>
            </Nav.Item>
        </Nav >
    )
}

export default Navbar