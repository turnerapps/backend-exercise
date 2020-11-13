const express = require('express');
const app = express();
const port = 3000;

function render_page(retval, view, status) {
    if (req.accepts('application/json') == 'application/json') {
        res.status(status).json(retval);
    } else {
        res.render(view, retval)
    }
    return;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');

app.get('/', (_req, res) => {
    res.render('main');
});

app.post('/above-below', (req, res) => {
    const { body } = req;
    let retval;
    if (!body.input || !body.input.length || !body.comparison || isNaN(body.comparison)) {
        const format = {
            "input": [1, 2, 3, 4, 5],
            "comparison": 3
        }
        retval = {
            "error": "Invalid input given",
            "message": `Please provide input in the format: ${JSON.stringify(format)}`,
            "body": body
        };
        render_page(retval, 'above-below-error', 400);
    } else {
        try {
            let above = 0;
            let below = 0;
            let input;
            if (body.input.toString().indexOf(',') > -1) {
                input = body.input.split(',');
            } else {
                input = body.input;
            }

            input.forEach(n => {
                if (n > body.comparison) above++;
                if (n < body.comparison) below++;
            });
            retval = { input: body.input, comparison: body.comparison, above, below };
            render_page(retval, 'above-below', 200);
        } catch (ex) {
            retval = {
                "error": "Invalid input given",
                "message": `Please provide input in the format: ${JSON.stringify(format)}`,
                "body": body
            };
            render_page(retval, 'above-below-error', 400);
        }
    }
});

app.post('/rotate', (req, res) => {
    const { body } = req;
    const format = {
        "string": "string",
        "overflow": 3
    }
    if (!body.string || !body.overflow) {
        retval = {
            "error": "Invalid input given",
            "message": `Please provide input in the format: ${JSON.stringify(format)}`,
            "body": body
        };
        render_page(retval, 'rotated-error', 400);
    } else {
        try {
            // Handle overflows greater than the length of the string
            const overflow = body.overflow % body.string.length;
            const rotated = body.string.substr(overflow * -1) + body.string.substr(0, body.string.length - overflow);
            retval = {
                "string": body.string,
                "overflow": body.overflow,
                "rotated": rotated
            }
            render_page(retval, 'rotated', 200);
        } catch (ex) {
            retval = {
                "error": "Invalid input given",
                "message": `Please provide input in the format: ${JSON.stringify(format)}`,
                "body": body
            };
            render_page(retval, 'rotated-error', 400);
        }
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});