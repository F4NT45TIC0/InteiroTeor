import React, { useState } from 'react';
import { 
  Box,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)({
  marginTop: '2rem',
  marginBottom: '2rem'
});

const StyledBox = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem'
});

const TextArea = styled(TextField)({
  width: '100%',
  marginTop: '1rem',
  '& .MuiInputBase-root': {
    height: '300px'
  }
});

const escreventes = [
  "Amadeu Coelho Pedralva dos Reis",
  "Oswaldo Paquier",
  "Yolanda Pereira de Souza",
  "Lourdes Matricardi Lourenço",
  "Lucio Dias de Toledo",
  "Francisco Braga de Arruda Botelho",
  "Julia Aguemi",
  "Atahualpa Franco de Godoy"
];

const App: React.FC = () => {
  const [tipo, setTipo] = useState('');
  const [anoModelo, setAnoModelo] = useState('');
  const [escrevente, setEscrevente] = useState('');
  const [averbacoes, setAverbacoes] = useState('0');
  const [texto, setTexto] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(texto);
  };

  return (
    <StyledContainer>
      <Typography variant="h3" align="center" gutterBottom>
        Sistema Cartório 2025
      </Typography>
      
      <StyledBox>
        <FormControl fullWidth>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={tipo}
            label="Tipo"
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="nascimento">Nascimento</MenuItem>
            <MenuItem value="casamento">Casamento</MenuItem>
            <MenuItem value="obito">Óbito</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Ano Modelo</InputLabel>
          <Select
            value={anoModelo}
            label="Ano Modelo"
            onChange={(e) => setAnoModelo(e.target.value)}
            disabled={!tipo}
          >
            <MenuItem value="1946">1946</MenuItem>
            <MenuItem value="1947-1976">1947-1976</MenuItem>
            <MenuItem value="1977-1984">1977-1984</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Escrevente</InputLabel>
          <Select
            value={escrevente}
            label="Escrevente"
            onChange={(e) => setEscrevente(e.target.value)}
          >
            {escreventes.map((esc) => (
              <MenuItem key={esc} value={esc}>{esc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Averbações</InputLabel>
          <Select
            value={averbacoes}
            label="Averbações"
            onChange={(e) => setAverbacoes(e.target.value)}
          >
            {[0,1,2,3,4,5].map((num) => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledBox>

      <TextArea
        multiline
        variant="outlined"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Button 
          variant="contained" 
          onClick={handleCopy}
        >
          Copy to Clipboard
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default App;