import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from 'react';
import { Col, Container, Row, Navbar, Button, Nav, Spinner, Form, Table } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import { MDBFooter, MDBContainer, MDBBtn } from 'mdb-react-ui-kit';
import Papa from 'papaparse'; // Import PapaParse
import Teams from './components/Teams';
import PlayerBid from './components/PlayerBid';

function Footer() {
  return (
    <MDBFooter className='bg-dark text-center text-white'>
      <MDBContainer className='p-4 pb-0'>
        <section className='mb-4'>
          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#3b5998' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-facebook"></i>
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#55acee' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-twitter"></i>
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#dd4b39' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-google"></i>
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#ac2bac' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-instagram"></i>
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#0082ca' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-linkedin"></i>
          </MDBBtn>

          <MDBBtn
            floating
            className='m-1'
            style={{ backgroundColor: '#333333' }}
            href='#!'
            role='button'
          >
            <i className="bi bi-github"></i>
          </MDBBtn>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 - emfourem
      </div>
    </MDBFooter>
  );
}

function Header({ searchTerm, setSearchTerm }) {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className='p-4'>Fantacalcio</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/squadre">Squadre</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function PlayersRoute({ players, setPlayer, filters, setFilters, initialFilters, searchTerm }) {
  const navigate = useNavigate();

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => (filters.role === '' || player.ruolo === filters.role))
    .filter(player => (filters.searchName === '' || player.nome.toLowerCase().includes(filters.searchName.toLowerCase())))
    .filter(player => (filters.squadra === '' || player.squadra === filters.squadra))
    .filter(player => player.nome.toLowerCase().includes(searchTerm.toLowerCase())) // Add searchTerm filter
    .sort((a, b) => {
      if (filters.priceSort === 'asc') {
        return a.quotazione - b.quotazione;
      } else {
        return b.quotazione - a.quotazione;
      }
    });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Extract unique Squadra options for the dropdown
  const squadreOptions = [...new Set(players.map(player => player.squadra))].sort();

  const handleAstaClick = (player) => {
    setPlayer(player);
    navigate('/asta');
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="mb-4 text-center">Elenco Giocatori</h2>
          
          {/* Filters */}
          <Form className="mb-4">
            <Row>
              <Col md={3}>
                <Form.Group controlId="filterRole">
                  <Form.Label>Ruolo</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tutti</option>
                    <option value="P">Portiere</option>
                    <option value="D">Difensore</option>
                    <option value="C">Centrocampista</option>
                    <option value="A">Attaccante</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="filterSquadra">
                  <Form.Label>Squadra</Form.Label>
                  <Form.Control
                    as="select"
                    name="squadra"
                    value={filters.squadra}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tutte</option>
                    {squadreOptions.map(squadra => (
                      <option key={squadra} value={squadra}>{squadra}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="sortPrice">
                  <Form.Label>Ordina per Prezzo</Form.Label>
                  <Form.Control
                    as="select"
                    name="priceSort"
                    value={filters.priceSort}
                    onChange={handleFilterChange}
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Discendente</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="searchName">
                  <Form.Label>Cognome Giocatore</Form.Label>
                  <Form.Control
                    type="text"
                    name="searchName"
                    value={filters.searchName}
                    onChange={handleFilterChange}
                    placeholder="Cerca per Cognome"
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Reset Filters Button */}
            <div className="d-flex justify-content-center mb-4 mt-4">
              <Button variant="primary" onClick={resetFilters} className="py-2 px-4">
                Reset Filtri
              </Button>
            </div>
          </Form>

          {/* Table */}
          {filteredPlayers.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Non ci sono giocatori da mostrare.</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ruolo</th>
                  <th>Quotazione</th>
                  <th>Squadra</th>
                  <th>Asta</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id}>
                    <td>{player.id}</td>
                    <td>{player.nome}</td>
                    <td>{player.ruolo}</td>
                    <td>{player.quotazione}</td>
                    <td>{player.squadra}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleAstaClick(player)}>
                        Asta
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

/**
 * The route for nonexisting URLs.
 * 
 * @returns JSX for the DefaultRoute component
 */

function DefaultRoute() {
  return (
    <Container fluid>
      <p className="my-2"> Nulla da mostrare. </p>
      <Link to='/'> Ritorna alla pagina principale! </Link>
    </Container>
  );
}


function App() {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  // Define initial filter states
  const initialFilters = {
    role: '',
    priceSort: 'desc',
    searchName: '',
    squadra: ''
  };

  // Initialize state with filters
  const [filters, setFilters] = useState(initialFilters);

  // Add searchTerm state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('/lista.csv'); // Path to the CSV file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csv = await response.text(); // Read as text

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedPlayers = results.data.map((row) => ({
              id: row.Id,
              nome: row.Nome,
              ruolo: row.R,
              quotazione: row['Qt.I'],
              squadra: row.Squadra,
            }));
            setPlayers(formattedPlayers);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}>
        <Route
          index
          element={
            loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Caricamento</span>  

                </Spinner>
              </div>
            ) : (
              <>
                {/* Conditionally render button based on teams state */}
                {!teams.length && (
                  <div className="d-flex justify-content-center mb-4 mt-4">
                    <Button variant="primary" as={Link} to="/squadre" className="py-2 px-4">
                      Crea Squadre
                    </Button>
                  </div>
                )}
                <PlayersRoute
                  players={players}
                  setPlayer={setPlayer}
                  filters={filters}
                  setFilters={setFilters}
                  initialFilters={initialFilters}
                  searchTerm={searchTerm} // Pass searchTerm to PlayersRoute
                />
              </>
            )
          }
        />
        <Route path="/squadre" element={<Teams teams={teams} setTeams={setTeams} />} />
        <Route path="/asta" element={<PlayerBid teams={teams} setTeams={setTeams} player={player} setPlayer={setPlayer} players={players} setPlayers={setPlayers} />} />
        <Route path="/*" element={<DefaultRoute />} />
      </Route>
    </Routes>
  );
}

/**
 * It defines the main structure of all the routes.
 * 
 * @returns JSX for the Layout component
 */

function Layout({ searchTerm, setSearchTerm }) {
  return (
    <Container fluid className="d-flex flex-column min-vh-100">
      <Row>
        <Col>
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Col>
      </Row>
      <Row className="flex-grow-1">
        <Col>
          <Outlet />
        </Col>
      </Row>
      <Row>
        <Col>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
