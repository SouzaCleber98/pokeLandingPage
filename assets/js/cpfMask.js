// Seleciona todos os campos com a classe 'cpf'
const cpfInputs = document.querySelectorAll('.cpf');

cpfInputs.forEach(cpfInput => {
  cpfInput.addEventListener('input', () => {
    let value = cpfInput.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (value.length > 11) value = value.slice(0, 11); // Limita o CPF a 11 dígitos

    // Aplica a máscara de CPF
    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')  // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2')  // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço

    cpfInput.value = value;  // Atualiza o valor no campo
  });
});
