const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  fetch(`/admin/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const productNode = btn.closest('article');
      productNode.parentNode.removeChild(productNode);
    })
    .catch((err) => {
      console.log(err);
    });
};
