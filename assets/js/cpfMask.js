const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, ''); // remove tudo que não for número

  if (value.length > 11) value = value.slice(0, 11);

  value = value
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});