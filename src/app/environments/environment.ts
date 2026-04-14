export const environment = {
    apiUsuariosAuth: 'http://localhost:3000/auth',    // Gateway para autenticación, redirige a :4000/anteiku
    apiUsuarios: 'http://localhost:3000/users',    // Gateway redirige a :4000/anteiku
    apiGrupos:   'http://localhost:3000/groups',  // Gateway redirige a :4001/anteiku
    apiTickets:  'http://localhost:3000/tickets'  // Gateway redirige a :4002/anteiku

    // apiUsuarios: 'http://localhost:4000/anteiku', // Node.js (Auth)
    // apiGrupos: 'http://localhost:4001/anteiku',    // Python (Grupos)
    // apiTickets: 'http://localhost:4002/anteiku'    // Python (Tickets)
};