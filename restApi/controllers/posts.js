exports.getPosts = (req, res, next) => {
  res.json({
    message: 'Success',
  });
};

exports.createPost = (req, res, next) => {
  console.log(req.body);
  res.json({
    message: 'Success',
  });
};
