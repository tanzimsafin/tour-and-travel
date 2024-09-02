const TourmatePost = require('../models/tourmatePost');
const wrapAsync = require('../utilis/wrapAsync');
const ExpressError = require('../utilis/expressError');
const { validateTourmatePost } = require('../middleware');

module.exports.index = wrapAsync(async (req, res) => {
    const posts = await TourmatePost.find({});
    res.render('tourmatePosts/index', { posts });
});

module.exports.renderNewForm = (req, res) => {
    res.render('tourmatePosts/new');
};

module.exports.createPost = [
    validateTourmatePost,
    wrapAsync(async (req, res) => {
        const post = new TourmatePost(req.body);
        post.author = req.user._id;
        await post.save();
        req.flash('success', 'Successfully created a new post!');
        res.redirect(`/tourmatePosts/${post._id}`);
    })
];


module.exports.showPost = wrapAsync(async (req, res) => {
    const post = await TourmatePost.findById(req.params.id).populate('author');
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/tourmatePosts');
    }
    res.render('tourmatePosts/show', { post });
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const post = await TourmatePost.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/tourmatePosts');
    }
    res.render('tourmatePosts/edit', { post });
});

module.exports.updatePost = [
    validateTourmatePost,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const post = await TourmatePost.findByIdAndUpdate(id, req.body, { new: true });
        req.flash('success', 'Successfully updated post!');
        res.redirect(`/tourmatePosts/${post._id}`);
    })
];

module.exports.deletePost = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await TourmatePost.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post!');
    res.redirect('/tourmatePosts');
});

module.exports.renderTourmatePool = wrapAsync(async (req, res) => {
    const posts = await TourmatePost.find({});
    res.render('tourmatePosts/tourmatepool', { posts });
});