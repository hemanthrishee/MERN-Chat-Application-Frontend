import React from "react";

function Signup(props) {
    return <div className="super">
    <div class="main">  	
        <input type="checkbox" id="chk" aria-hidden="true" />
            <div class="signup">
                <form onSubmit={props.signupSubmit}>
                    <label for="chk" aria-hidden="true">Sign up</label>
                    <p style={{color: "green", paddingLeft: "25px"}}>{props.signupStatus === "" ? "": props.signupStatus === "exists" ? "Email is already Registered, Please Login" : "Registered Successfully, Proceed to login"}</p>
                    <input onChange={props.signupChanged} type="text" name="name" placeholder="User name" required />
                    <input onChange={props.signupChanged} type="email" name="email" placeholder="Email" required />
                    <input onChange={props.signupChanged} type="password" name="password" placeholder="Password" required />
                    <button type="submit">Sign up</button>
                </form>
            </div>

            <div class="login">
                <form onSubmit={props.loginSubmit}>
                    <label for="chk" aria-hidden="true">Login</label>
                    <p style={props.loginStatus === "nope" ? {color: "red", paddingLeft: "78px"} :{color: "green"}}>{props.loginStatus === "" ? "": props.loginStatus === "nope" ? "Invalid Email or Password" : "Login Successful"}</p>
                    <input onChange={props.loginChanged} type="email" name="email" placeholder="Email" required />
                    <input onChange={props.loginChanged} type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    </div>;
}

export default Signup;