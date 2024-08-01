import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Button, Table } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import io from 'socket.io-client';
import '../App.css'; // Import the CSS file

const socket = io('http://localhost:5000'); // Replace with your server's IP address

// Helper function to calculate the remaining budget and maximum bid
function calculateMaxBid(team) {
  const totalSpent = team.p.reduce((sum, player) => sum + player.amount, 0) +
    team.d.reduce((sum, player) => sum + player.amount, 0) +
    team.c.reduce((sum, player) => sum + player.amount, 0) +
    team.a.reduce((sum, player) => sum + player.amount, 0);

  const currentPlayerCount = team.p.length + team.d.length + team.c.length + team.a.length;
  const remainingPlayers = 25 - currentPlayerCount - 1; // Adjust for 1 more player

  const minRequiredForPlayers = remainingPlayers;
  const maxBid = team.credit - totalSpent - minRequiredForPlayers;

  return maxBid;
}

// BidTimer Component
function BidTimer({ timer }) {
  return (
    <div className="text-center mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <div style={{ width: '250px', height: '250px' }}>
        <CircularProgressbar
          value={timer * 20}
          text={`${timer}`}
          styles={buildStyles({
            pathColor: '#007bff',
            textColor: '#000',
            trailColor: '#d6d6d6',
            strokeWidth: 16 // Adjust thickness
          })}
        />
      </div>
    </div>
  );
}

// BidResult Component
function BidResult({ bid, showResult }) {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (bid) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 1000); // Highlight for 1 second

      return () => clearTimeout(timer);
    }
  }, [bid]);

  const messageStyle = {
    fontSize: '1.5rem', // Adjust font size as needed
    fontWeight: 'bold', // Optional: make text bold
  };

  return showResult ? (
    <Alert variant="success" className={`text-center ${highlight ? 'highlight' : ''}`} style={messageStyle}>
      Vincente: {bid.teamName} - Prezzo: {bid.amount}
    </Alert>
  ) : (
    bid && (
      <Alert variant="info" className={`mb-3 text-center ${highlight ? 'highlight' : ''}`} style={messageStyle}>
        Ultima offerta: {bid.teamName} - Prezzo: {bid.amount}
      </Alert>
    )
  );
}

// MaximumBidTable Component
function MaximumBidTable({ teams }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">Offerta Massima</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome Squadra</th>
              <th>Crediti</th>
              <th>Massima Offerta</th>
              <th>P</th>
              <th>D</th>
              <th>C</th>
              <th>A</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const maxBid = calculateMaxBid(team);
              return (
                <tr key={team.name}>
                  <td>{team.name}</td>
                  <td>{team.credit}</td>
                  <td>{maxBid > 0 ? maxBid : 0}</td>
                  <td>{team.p.length}</td>
                  <td>{team.d.length}</td>
                  <td>{team.c.length}</td>
                  <td>{team.a.length}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

// Main PlayerBid Component
function PlayerBid({ teams, setTeams, player, setPlayer, players, setPlayers }) {
  const navigate = useNavigate();
  const [bid, setBid] = useState(null); // Store only the last bid
  const [timer, setTimer] = useState(5); // Initialize timer with 5 seconds
  const [showResult, setShowResult] = useState(false); // To show result after timer ends
  const [isFinalBid, setIsFinalBid] = useState(false); // To indicate if the bid is final

  useEffect(() => {
    socket.on('new_bid', (data) => {
      console.log('New bid received:', data);

      if (isFinalBid) {
        return; // Discard any new bids after the timer has elapsed
      }

      const team = teams.find(t => t.name === data.name);
      if (!team) return;

      const maxBid = calculateMaxBid(team);
      const newBidAmount = (bid?.amount || 0) + 1;

      if (newBidAmount > maxBid) {
        return;
      }

      const roleList = {
        'P': 'p',
        'D': 'd',
        'C': 'c',
        'A': 'a'
      }[player.ruolo];

      const rosterRequirements = {
        p: 3,
        d: 8,
        c: 8,
        a: 6
      };

      if (team[roleList].length >= rosterRequirements[roleList]) {
        return;
      }

      setBid({
        teamName: team.name,
        amount: newBidAmount
      });

      setTimer(5); // Reset timer
      setShowResult(false);
    });

    return () => {
      socket.off('new_bid');
    };
  }, [bid, player, teams, isFinalBid]);

  useEffect(() => {
    if (!bid || !player) return;

    const updateTeams = () => {
      const { teamName, amount } = bid;
      const role = player.ruolo;

      const lowercaseRole = {
        'P': 'p',
        'D': 'd',
        'C': 'c',
        'A': 'a'
      }[role];

      if (!lowercaseRole) {
        return;
      }

      const team = teams.find(t => t.name === teamName);
      if (!team) return;

      const maxBid = calculateMaxBid(team);

      if (amount > maxBid) {
        return;
      }

      const updatedTeams = teams.map(t => {
        if (t.name === teamName) {
          return {
            ...t,
            [lowercaseRole]: [
              ...t[lowercaseRole],
              {
                player: player.nome,
                id: player.id,
                amount: amount
              }
            ],
            credit: t.credit - amount
          };
        }
        return t;
      });

      setTeams(updatedTeams);

      const updatedPlayers = players.filter(p => p.id !== player.id);
      setPlayers(updatedPlayers);
    };

    let intervalId;

    if (bid && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalId);
            setShowResult(true);
            setIsFinalBid(true); // Set isFinalBid to true when timer reaches 0
            updateTeams();
            setTimeout(() => navigate('/'), 3000);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [bid, player, timer, setTeams, setPlayers, isFinalBid, navigate]);

  const roleMap = {
    'P': 'Portiere',
    'D': 'Difensore',
    'C': 'Centrocampista',
    'A': 'Attaccante'
  };

  const playerNotSelected = !player || !player.id;
  const teamsNotAvailable = teams.length === 0;

  if (playerNotSelected || teamsNotAvailable) {
    return (
      <div className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">
                  {playerNotSelected ? 'Nessun giocatore selezionato.' : 'Nessuna squadra presente.'}
                </Card.Title>
                <Button variant="secondary" className="mt-3 w-100" onClick={() => { setPlayer(null); navigate(-1); }}>
                  Indietro
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const roleName = roleMap[player.ruolo] || 'Unknown Role';

  return (
    <Container className="my-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Offerta per {player.nome}</Card.Title>
              <p className="text-center">Ruolo: {roleName}</p>
              <BidTimer timer={timer} />
              <BidResult bid={bid} showResult={showResult} />
              <Row className="text-center">
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setBid(null); // Reset bid
                      setTimer(5); // Reset timer
                      setShowResult(false); // Hide result
                    }}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <MaximumBidTable teams={teams} />
        </Col>
      </Row>
    </Container>
  );
}

export default PlayerBid;
