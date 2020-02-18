import express from "express";
import crypto from "crypto-js";
// import tedious from "tedious";
import cors from "cors";
import mysql from "mysql";

let router = express.Router();
/*let Connection = tedious.Connection;
let Request = tedious.Request;*/


let mysqlEnv = {
    database: 'heroku_537ca9b5b95db5f',
    host: 'eu-cdbr-west-02.cleardb.net',//localhost
    user: 'bc8be747ba4ac8',//root
    password: '36d14e8c'
}

let connection = mysql.createConnection(mysqlEnv);

let app = express();
app.use(cors());

//old way actually it's same, this line is more simple
/*app.use((req:any, res:any, next:any)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})*/

app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//page
router.get('/', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    res.json('ok');
});

router.get('/home', (req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, (req: any, res: any) => {
    res.render('home');
});

router.get('/header', function (req: any, res: any) {
    res.render('storyheader');
});

router.get('/allUser', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    connection.query('SELECT * FROM users', function (err: any, results: any) {
        return res.json(results)
    })
})

router.post('/regUser', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let username = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let password = crypto.SHA256(req.body.password).toString();

    connection.query('INSERT INTO users(username, name, email, password, role) VALUES(?, ?, ?, ?, ?)',
        [username, name, email, password, 'user'], function (err: any, result: any) {
            if (err) {
                return res.json({
                    status: 'error',
                    message: err.message
                })
            } else {
                return res.json({
                    status: 'success'
                })
            }
        })
})

router.post('/doLogin', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let username = req.body.username;
    let password = crypto.SHA256(req.body.password).toString();

    let query: any = {
        sql: "SELECT username, password FROM users WHERE username=? or email=?",
        timeout: 40000
    }

    connection.query(query, [username, username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            if (result[0].password === password) {
                return res.json({
                    status: 'success',
                    username: result[0].username,

                })
            }
            else {
                return res.json({
                    status: 'invalid'
                })
            }
        }
    })
})

router.post('/detail', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let id = req.body.id

    let query: any = {
        sql: 'SELECT StoryID, author, category, thumbnail, Title, synopsis, readsCount, DATE(publishDate) as date, rating FROM story WHERE StoryId=?',
        timeout: 40000
    }
    connection.query(query, [id], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            let date = new Date(result[0].date)
            let publisDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
            return res.json({
                // result
                id: result[0].StoryID,
                author: result[0].author,
                img: result[0].thumbnail,
                title: result[0].Title,
                category: result[0].category,
                synopsis: result[0].synopsis,
                reads: result[0].readsCount,
                date: publisDate,
                rating: result[0].rating
            })
        }
    })
})

router.get('/getStories', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {

    let query: any = {
        sql: 'SELECT StoryID, author, thumbnail, Title, synopsis, readsCount, DATE(publishDate) as date, rating FROM story',
        timeout: 40000
    }
    connection.query(query, function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            let stories = [];
            for (let i = 0; i < result.length; i++) {
                let date = new Date(result[i].date)
                let publisDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
                let story = {
                    id: result[i].StoryID,
                    author: result[i].author,
                    img: result[i].thumbnail,
                    title: result[i].Title,
                    synopsis: result[i].synopsis,
                    reads: result[i].readsCount,
                    date: publisDate,
                    rating: result[i].rating
                }
                stories.push(story)
            }
            return res.json(stories)
        }
    })
})

router.post('/getAudioData', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let id = req.body.id

    let query: any = {
        sql: 'SELECT * FROM audioData where storyID=?',
        timeout: 40000
    }
    connection.query(query, [id], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json(result)
        }
    })
})

//test crypto
router.post('/check', function (req: any, res: any) {
    let pass = req.body.pass

    return res.json({
        pass: crypto.SHA256(pass).toString()
    })
})

router.post('/story', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let id = req.body.id

    let query: any = {
        sql: 'SELECT content, audio, data, dataSync FROM story s JOIN audioData ad on s.StoryID = ad.StoryID where s.StoryID=?',
        timeout: 40000
    }
    connection.query(query, [id], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            let url = 'http://storiette-api.herokuapp.com/audio/'
            let audio = url + result[0].audio

            let urldata = 'http://storiette-api.azurewebsites.net/data/'
            let data = urldata + result[0].dataSync

            let dataArr = JSON.parse(result[0].data)
            let newArr: string[] = []
            for (const ar of dataArr) {
                ar.id -= 1;
                newArr = [...newArr, ar]
            }

            return res.json({
                content: result[0].content,
                audio: audio,
                data: newArr
            })
        }
    })
})

router.post('/postStoryComment', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let storyId = req.body.storyId
    let username = req.body.username
    let commentText = req.body.commentText

    let query: any = {
        sql: `
        INSERT INTO comment (
          storyHeaderId,
          username,
          commentText,
          seen
        ) values (
          ?, ?, ?, 0
        )
      
      `,
        timeout: 40000
    }
    connection.query(query, [storyId, username, commentText], function (err, result) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json({
                status: 'success'
            })
        }
    })
})

router.post('/getStoryComment', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let storyId = req.body.storyId
    let query: any = {
        sql: 'SELECT * FROM comment WHERE storyHeaderId=?',
        timeout: 40000
    }
    connection.query(query, [storyId], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json(result)
        }
    })
})

router.post('/postUserHistory', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let storyId = req.body.storyId
    let username = req.body.username

    let query: any = {
        sql: `
      insert into history(StoryHeaderID, username) 
      values(?, ?)
      `,
        timeout: 40000
    }
    connection.query(query, [storyId, username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json({
                status: 'success'
            })
        }
    })
})

router.post('/postUserHistory', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let storyId = req.body.storyId
    let username = req.body.username

    let query: any = {
        sql: `
      insert into history(StoryHeaderID, username) 
      values(?, ?)
      `,
        timeout: 40000
    }
    connection.query(query, [storyId, username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json({
                status: 'sukses'
            })
        }
    })
})

router.post('/getUserHistory', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let username = req.body.username

    let query: any = {
        sql: `
      select distinct s.StoryId, Title, thumbnail from history h
      join story s
      on h.StoryHeaderID = s.StoryID
      where username=?
      order by id desc
      limit 5
      `,
        timeout: 40000
    }
    connection.query(query, [username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json(result)
        }
    })
})

router.post('/postUserFavorite', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let storyId = req.body.storyId
    let username = req.body.username

    let query: any = {
        sql: `
      insert into favorite(StoryHeaderID, username) 
      values(?, ?)
      `,
        timeout: 40000
    }
    connection.query(query, [storyId, username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json({
                status: 'success'
            })
        }
    })
})

router.post('/getUserFavorite', function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}, function (req: any, res: any) {
    let username = req.body.username

    let query: any = {
        sql: `
      select distinct s.StoryId, Title, thumbnail from favorite h
      join story s
      on h.StoryHeaderID = s.StoryID
      where username=?
      order by id desc
      `,
        timeout: 40000
    }
    connection.query(query, [username], function (err: any, result: any) {
        if (err) {
            return res.json({
                status: 'error',
                message: err.message
            })
        }
        else {
            return res.json(result)
        }
    })
})

// module.exports = router;

export default router;