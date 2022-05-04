import jsSHA from 'jssha';

export default function initUsersController(db) {
  const root = (req, res) => {
    res.render('main');
  };

  const login = async (req, res) => {
    console.log(req.body);
    try {
      const user = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log('user', user);

      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPassword = shaObj.getHash('HEX');
      console.log('hashed password', hashedPassword);

      if (hashedPassword === user.password) {
        res.cookie('loggedIn', true);
        res.cookie('userId', user.id);
        res.send({ user });
      } else {
        console.log('not logged in ');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return { root, login };
}
