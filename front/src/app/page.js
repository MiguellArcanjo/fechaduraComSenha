"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import styles from "@/app/page.module.css";

export default function Home() {
  const [numberSequence, setNumberSequence] = useState('');
  const [result, setResult] = useState('Digite a senha');
  const correctPassword = '321';
  let inputClass;

  const Calcu = (e) => {
    let valor = e.target.value;
    setNumberSequence(prev => prev + valor);
  };

  const Clear = () => {
    setResult('Digite a senha')
    setNumberSequence('');
  };

  const ClearAutomatic = () => {
    setNumberSequence('');
  };

  const handlePost = async () => {
    try {

      const response = await fetch('http://localhost:3333/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha: numberSequence }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta do servidor:', data);
        
        if (numberSequence === correctPassword) {
          setResult('Senha correta!');
        } else if (numberSequence !== correctPassword) {
          setResult('Senha incorreta');
        }

        ClearAutomatic(); 
      } else {
        console.error('Erro ao enviar dados:', response.status);
        setResult('Erro ao enviar senha');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setResult('Erro na requisição');
    }
  };

  
  if (result === 'Senha correta!') {
    inputClass = styles.inputCorrect;
  } else if (result === 'Senha incorreta') {
    inputClass = styles.inputIncorrect;
  } else {
    inputClass = styles.input;
  }

  return (
    <section className={styles.container}>
      <div className={styles.calc}>
        <input
          className={inputClass}
          type='text'
          value={numberSequence}
          placeholder={result}
          readOnly
        />
        <div className={styles.grid}>
          {[7, 8, 9].map((valor) => (
            <Button key={valor} valor={valor} value={valor} NewNumber={Calcu} />
          ))}

          {[4, 5, 6].map((valor) => (
            <Button key={valor} valor={valor} value={valor} NewNumber={Calcu} />
          ))}

          {[3, 2, 1].map((valor) => (
            <Button key={valor} valor={valor} value={valor} NewNumber={Calcu} />
          ))}

          <Button valor={0} value={0} NewNumber={Calcu} />
          <Button valor={'<-'} value={'C/A'} NewNumber={Clear} />
          <Button valor={'✅'} value={'='} NewNumber={handlePost} />
        </div>
      </div>
    </section>
  );
}
