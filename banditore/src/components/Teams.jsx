import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';

function Teams({ teams, setTeams }) {
  const [teamCount, setTeamCount] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [isNaming, setIsNaming] = useState(false);

  // Handle the number of teams form submission
  const handleTeamCountSubmit = (e) => {
    e.preventDefault();
    const count = Number(teamCount);
    if (count <= 0) return;

    // Initialize team names array with empty strings
    setTeamNames(Array(count).fill(''));
    setIsNaming(true); // Show name input form
  };

  // Handle team name input changes
  const handleNameChange = (index, value) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = value;
    setTeamNames(updatedNames);
  };

  // Finalize team creation
  const handleFinalizeTeams = () => {
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
    setIsNaming(false); // Hide the name input form and show the table
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {teams.length === 0 ? (
            !isNaming ? (
              // Number of teams form
              <Form onSubmit={handleTeamCountSubmit}>
                <Form.Group controlId="teamCount">
                  <Form.Label>Numero di squadre partecipanti</Form.Label>
                  <Form.Control
                    type="number"
                    value={teamCount}
                    onChange={(e) => setTeamCount(e.target.value)}
                    placeholder="Inserisci il numero di squadre"
                    min="4"
                    max="14"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Vai
                </Button>
              </Form>
            ) : (
              // Team names input form
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
                <Button variant="success" type="submit" className="mt-3">
                  Finalizza
                </Button>
              </Form>
            )
          ) : (
            <>
              <h2 className="text-center mb-3">Dettagli Squadre</h2>
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
                            <div key={index}>{player.player} - {player.amount}</div>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {team.d.length > 0 ? (
                          team.d.map((player, index) => (
                            <div key={index}>{player.player} - {player.amount}</div>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {team.c.length > 0 ? (
                          team.c.map((player, index) => (
                            <div key={index}>{player.player} - {player.amount}</div>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {team.a.length > 0 ? (
                          team.a.map((player, index) => (
                            <div key={index}>{player.player} - {player.amount}</div>
                          ))
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center mb-4 mt-4">
                <Button variant="primary" onClick={() => {}} className="py-2 px-4">
                  Genera Squadre
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Teams;
