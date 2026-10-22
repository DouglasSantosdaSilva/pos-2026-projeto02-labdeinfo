import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Publica } from '../components/Publica'

export default function Entrada() {
  const navigate = useNavigate()

  useEffect(() => {
    // Se já tiver token guardado, redireciona diretamente
    if (localStorage.getItem('access')) {
      navigate('/')
    }
  }, [navigate])

  return (
    <Publica
      titulo="Bem-vindo ao LabAgenda"
      subTitulo="Reserve horários para utilizar os computadores e laboratórios de informática."
    >
      <div className="d-flex flex-column gap-3 mt-2">
        <Button variant="primary" size="lg" className="w-100" onClick={() => navigate('/login')}>
          Entrar
        </Button>
        <Button variant="outline-primary" size="lg" className="w-100" onClick={() => navigate('/cadastro')}>
          Criar conta
        </Button>
      </div>
    </Publica>
  )
}