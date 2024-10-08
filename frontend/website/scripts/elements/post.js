function Post () {
    const createPost = async () => {
        const comments = [];
        const title = document.querySelector('#Title').value;
        const published = document.querySelector('#Published').checked;
        const text = document.querySelector('#Text').value;

        const data = { comments, title, published, text };
        const jsonData = JSON.stringify(data);
        
        const url = 'http://localhost:5000/post_form';
        const response = await fetch (url, {
            method: 'POST',
            body: jsonData,
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` ,
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        if (json.error) {
            throw new Error(json.msg);
        }
        
        return json;
    };

    const findPostID = async (item) => {
        const title = item[0].textContent;
        const text = item[1].textContent;
        
        const data = { title, text };
        const jsonData = JSON.stringify(data);
        
        const url = `http://localhost:5000/postID`;
        const response = await fetch(url, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        
        const json = await response.json();
        if (json.error) {
            throw new Error(json.msg);
        }

        const id = await json.id;
        return id;
    };

    const updatePost = async (id, title, published, text) => {
        const url = 'http://localhost:5000/post_update';
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ postID: id, title, published, text }),
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json' 
            }
        });

        const json = await response.json();
        if (json.error) {
            throw new Error(json.msg);
        }
        return json;
    };

    const deletePost = async (id) => {
        const url = 'http://localhost:5000/post_delete/';
        const response = await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({ postID: id }),
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'  
            }
        });

        const json = await response.json();
        if (json.error) {
            throw new Error(json.msg);
        }

        return json;
    };

    const getPosts = async () => {
        const url = 'http://localhost:5000/posts';
        const response = await fetch(url);

        const json = await response.json();
        if (json.error) {
            throw new Error(json.msg);
        }

        const posts = await json.allPosts;
        return posts;
    };


    return { createPost, findPostID, updatePost, deletePost, getPosts };
};

function givePostForm (e) {
    e.preventDefault();

    const postArray = [
        { name: 'Title', input: 'text' },
        { name: 'Published', input: 'checkbox' },
        { name: 'Text', input: 'text' }
    ];

    const add = document.querySelector('#create');
    if (add) {
        add.style.visibility = 'hidden';
    }

    const div = document.createElement('div');
    div.classList.add('form_container');

    const form = document.createElement('form');
    
    postArray.forEach(element => {
        const label = document.createElement('label');
        let input = document.createElement('input');
        let boolean = true;
        
        label.for = element.name;
        label.textContent = `${element.name}: `;

        if (element.input === 'text') {
            input = document.createElement('textarea');
            input.name = element.name;
            boolean = false;
        }

        input.id = element.name;
        if (boolean) input.type = element.input;
        
        form.appendChild(label);
        form.appendChild(input);
    });

    const create = document.createElement('button');
    create.classList.add('create');
    create.type = 'submit';
    const cancel = document.createElement('button');
    cancel.classList.add('cancel');
    cancel.onclick = deletePostForm;

    create.textContent = 'Create';
    cancel.textContent = 'Cancel';

    form.appendChild(create);
    form.appendChild(cancel);
    form.classList.add('post_form');

    div.appendChild(form);
    document.body.appendChild(div);
}

function deletePostForm (e) {
    e.preventDefault();

    const add = document.querySelector('#create');
    if (add) {
        add.style.visibility = 'visible';
    }

    const div = document.querySelector('.form_container');
    div.remove();
}

export { Post, givePostForm, deletePostForm };