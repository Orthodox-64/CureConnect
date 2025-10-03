// Creating tokens & saving in cookies

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    
    // Options for cookies
    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/'
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token: token,
        user: user
    })
}

module.exports = sendToken