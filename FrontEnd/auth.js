function verificarAutenticacao() {
  const token = localStorage.getItem('authToken');
  const usuario = localStorage.getItem('usuarioAtual');
  
  if (!token || !usuario) {
    console.warn('Usuário não autenticado. Redirecionando para login...');
    alert('Você precisa fazer login para acessar esta página!');
    window.location.href = '../login/login.html';
    return null;
  }
  
  return JSON.parse(usuario);
}

function fazerLogout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('usuarioAtual');
  localStorage.removeItem('usuarioNome');
  localStorage.removeItem('usuarioId');
  
  console.log('Logout realizado');
  alert('Logout realizado com sucesso!');
  
  window.location.href = '../login/login.html';
}