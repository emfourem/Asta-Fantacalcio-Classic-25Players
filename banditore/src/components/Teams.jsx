import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

function Teams({ teams, setTeams, players, setPlayers }) {
  const [teamCount, setTeamCount] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [isNaming, setIsNaming] = useState(false);
  const [error, setError] = useState('');
  const [importFile, setImportFile] = useState(null); // State to hold the imported file

  const requiredPlayers = { p: 3, d: 8, c: 8, a: 6 };

  // Handle file input change
  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleFileImport = () => {
    if (!importFile) {
      setError('Per favore, seleziona un file da importare.');
      return;
    }
    
    console.log("aoooo");
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const updatedTeams = [...teams]; // Create a copy of the existing teams
  
      lines.forEach(line => {
        const match = line.match(/Squadra: (.*?), Giocatore: (.*?), Ruolo: (.*?), Id: (\d+), Crediti: (\d+)/);
        if (match) {
          const [, teamName, playerName, playerRole, playerId, playerAmount] = match;
          const amount = Number(playerAmount);
          const player = { player: playerName, id: playerId, amount: amount };
  
          // Find the team in the existing teams
          const teamIndex = updatedTeams.findIndex(t => t.name === teamName);
          if (teamIndex === -1) {
            console.error(`La squadra '${teamName}' non è stata trovata.`);
            return;
          }
  
          const team = updatedTeams[teamIndex];
          if (playerRole === 'p') team.p.push(player);
          else if (playerRole === 'd') team.d.push(player);
          else if (playerRole === 'c') team.c.push(player);
          else if (playerRole === 'a') team.a.push(player);
  
          // Deduct player amount from team credits
          team.credit -= amount;
  
          // Remove player from the global player list
          setPlayers((prevPlayers) => prevPlayers.filter(p => p.id !== playerId));
        }
      });
  
      setTeams(updatedTeams);
    };
  
    reader.readAsText(importFile);
    setError('');
  };

  const handleTeamCountSubmit = (e) => {
    e.preventDefault();
    const count = Number(teamCount);
    if (count <= 0) {
      setError('Il numero di squadre deve essere maggiore di 0.');
      return;
    }
    setError('');
    setTeamNames(Array(count).fill(''));
    setIsNaming(true);
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = value;
    setTeamNames(updatedNames);
  };

  const handleFinalizeTeams = () => {
    if (teamNames.some(name => !name.trim())) {
      setError('Tutti i nomi delle squadre devono essere compilati.');
      return;
    }
    setError('');
    const newTeams = teamNames.map((name, index) => ({
      id: index + 1,
      name: name,
      credit: 500,
      p: [],
      d: [],
      c: [],
      a: [],
    }));
    setTeams(newTeams);
    setIsNaming(false);
  };

  const generateCSV = () => {
    if (!teams.every((team) => isTeamValid(team, requiredPlayers))) {
      setError('Attenzione! Alcune squadre non hanno il numero richiesto di giocatori per ogni ruolo.');
      return;
    }

    let csvContent = "";

    teams.forEach((team) => {
      csvContent += "$,$,$\n";
      team.p.forEach((player) => {
        csvContent += `${team.name},${player.id},${player.amount}\n`;
      });
      team.d.forEach((player) => {
        csvContent += `${team.name},${player.id},${player.amount}\n`;
      });
      team.c.forEach((player) => {
        csvContent += `${team.name},${player.id},${player.amount}\n`;
      });
      team.a.forEach((player) => {
        csvContent += `${team.name},${player.id},${player.amount}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'rosters.csv');
  };

  const isTeamValid = (team, required) => {
    return (
      team.p.length === required.p &&
      team.d.length === required.d &&
      team.c.length === required.c &&
      team.a.length === required.a
    );
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {teams.length === 0 ? (
            !isNaming ? (
              <Card className="p-4">
                <Card.Body>
                  <h3 className="text-center mb-4">Imposta il Numero di Squadre</h3>
                  <Form onSubmit={handleTeamCountSubmit} className="mb-4">
                    <Form.Group controlId="teamCount">
                      <Form.Label>Numero di squadre partecipanti</Form.Label>
                      <Form.Control
                        type="number"
                        value={teamCount}
                        onChange={(e) => setTeamCount(e.target.value)}
                        placeholder="Inserisci il numero di squadre"
                        min="2"
                        max="12"
                        className="mb-3"
                      />
                    </Form.Group>
                    <div className="text-center">
                      <Button variant="primary" type="submit">
                        Vai
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Card className="p-4">
                <Card.Body>
                  <h3 className="text-center mb-4">Nome Squadre</h3>
                  <Form onSubmit={handleFinalizeTeams}>
                    {teamNames.map((name, index) => (
                      <Form.Group controlId={`teamName${index}`} key={index} className="mb-3">
                        <Form.Label>Nome Squadra {index + 1}</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder={`Nome per la squadra ${index + 1}`}
                        />
                      </Form.Group>
                    ))}
                    <div className="text-center">
                      <Button variant="success" type="submit" className="mt-3">
                        Finalizza
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )
          ) : (
            <Card className="p-4">
              <Card.Body>
                <h2 className="text-center mb-4">Dettagli Squadre</h2>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Crediti</th>
                      <th>Portieri</th>
                      <th>Difensori</th>
                      <th>Centrocampisti</th>
                      <th>Attaccanti</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td>{team.credit}</td>
                        <td>
                          {team.p.length > 0 ? (
                            team.p.map((player, index) => (
                              <div key={index}>{player.player} - {player.id} - {player.amount}</div>
                            ))
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {team.d.length > 0 ? (
                            team.d.map((player, index) => (
                              <div key={index}>{player.player} - {player.id} - {player.amount}</div>
                            ))
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {team.c.length > 0 ? (
                            team.c.map((player, index) => (
                              <div key={index}>{player.player} - {player.id} - {player.amount}</div>
                            ))
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {team.a.length > 0 ? (
                            team.a.map((player, index) => (
                              <div key={index}>{player.player} - {player.id} - {player.amount}</div>
                            ))
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Row className="mb-4 d-flex justify-content-center">
                  <Col xs="auto" className="d-flex align-items-center">
                    <Button variant="primary" as={Link} to="/" className="py-2 px-4 me-2">
                      Indietro
                    </Button>
                    <Form.Group className="d-flex align-items-center me-2">
                      <Form.Control
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        className="me-2"
                      />
                      <Button variant="primary" onClick={handleFileImport}>
                        Importa Squadre
                      </Button>
                    </Form.Group>
                    <Button variant="primary" onClick={generateCSV} className="py-2 px-4">
                      Genera Squadre
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Teams;
