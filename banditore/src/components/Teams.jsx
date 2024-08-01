import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

function Teams({ teams, setTeams }) {
  const [teamCount, setTeamCount] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [isNaming, setIsNaming] = useState(false);
  const [error, setError] = useState('');
  const requiredPlayers = { p: 3, d: 8, c: 8, a: 6 };

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
      alert('Attenzione! Alcune squadre non hanno il numero richiesto di giocatori per ogni ruolo.');
      return;
    }

    let csvContent = "";

    teams.forEach((team, teamIndex) => {
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
                        min="4"
                        max="14"
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
                <Row className="justify-content-center mb-4">
                  <Col xs="auto">
                    <Button variant="primary" as={Link} to="/" className="py-2 px-4">
                      Indietro
                    </Button>
                  </Col>
                  <Col xs="auto">
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
