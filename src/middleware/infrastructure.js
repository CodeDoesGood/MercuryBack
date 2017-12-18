function hello(req, res) {
  res.status(200).send({ message: 'hello' });
}

module.exports = {
  hello,
};
