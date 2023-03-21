const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const auth = require('./auth');
const app = express();
const pool = require('./db');
const cors = require('cors');
const blacklist = []; // Your blacklist or revocation list

// Configure passport
passport.use(new LocalStrategy({ usernameField: 'email' }, auth.authenticateUser));
passport.use(new JwtStrategy({
    secretOrKey: 'mysecret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (payload, done) => {
    // Verify token against blacklist
    if (blacklist.includes(payload.token)) {
        return done(null, false);
    }

    // Verify token
    auth.verifyToken(payload, done);
}));

// Enable CORS
app.use(cors());
// Parse JSON request bodies
app.use(bodyParser.json());

// Login route
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = auth.generateToken(req.user);
    return res.json({ user: req.user, token });
});

// Register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await auth.registerUser(email, password, pool);
        const token = auth.generateToken(user);
        return res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Get the token from the header
    // Add the token to the blacklist
    blacklist.push(token);

    // Revoke the token on the server-side
    // TODO: Implement token revocation logic here

    res.status(200).send('Logged out successfully');
});

app.get('/api/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { user_id } = req.user;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        const user = rows[0];
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ message: 'Protected content.' });
});


app.get('/courses', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { user_id } = req.user;
    const query = `
    SELECT c.*
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = $1
  `;
    pool.query(query,
        [user_id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
});

app.put('/api/courses/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const { course_name, course_code, level, department, instructor, start_date, end_date, description } = req.body;

    try {
        // Update the course information in the database
        const result = await pool.query(
            'UPDATE Courses SET course_name = $1, course_code = $2, level = $3, department = $4, instructor = $5, description = $6, start_date = $7, end_date = $8 WHERE id = $9 RETURNING *',
            [course_name, course_code, level, department, instructor, description, start_date, end_date, id]
        );

        // Check if the course was found and updated
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Send the updated course as the response
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the course' });
    }
});

app.post('/api/courses', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(req.body)
    const { user_id } = req.user;
    const { course_name, course_code, level, department, instructor, start_date, end_date, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Courses (course_name, course_code, level, department, instructor, description, start_date, end_date, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [course_name, course_code, level, department, instructor, description, start_date, end_date, user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/courses/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const courseId = req.params.id;

    // First, check if the course exists
    pool.query('SELECT * FROM courses WHERE id = $1', [courseId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching course from database');
            return;
        }

        if (result.rows.length === 0) {
            res.status(404).send('Course not found');
            return;
        }

        // If the course exists, delete it from the database
        pool.query('DELETE FROM courses WHERE id = $1', [courseId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting course from database');
                return;
            }

            res.sendStatus(204); // 204 No Content
        });
    });
});

app.get('/grades', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { user_id } = req.user;
    const query = `
    SELECT c.*, a.title as assignment_title
    FROM assignment_progress c
    JOIN assignments a ON c.assignment_id = a.id
    WHERE c.user_id = $1
  `;
    pool.query(query,
        [user_id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
});

app.get('/exams', passport.authenticate('jwt', { session: false }), (req, res) => {
    const startDate = req.query.startDate; // get the start date from the query parameters
    const endDate = req.query.endDate; // get the end date from the query parameters
    // const email = req.params.email; // get the user's email from the URL params
    const { user_id } = req.user;

    const query = `
      SELECT exams.*
      FROM enrollments
      INNER JOIN users ON enrollments.user_id = users.user_id
      INNER JOIN courses ON enrollments.course_id = courses.id
      INNER JOIN exams ON courses.id = exams.course_id
      WHERE users.user_id = $1
    `;
    pool.query(query,
        [user_id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
});

app.get('/assignments', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { user_id } = req.user;
    const query = `
      SELECT a.*
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = $1
    `;
    const values = [user_id];
    try {
      const { rows } = await pool.query(query, values);
      res.send(rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  
app.listen(8080, () => {
    console.log('Server running on port 8080');
});
