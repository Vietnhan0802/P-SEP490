import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../src/scss/notfound.scss'
function NotFound() {
    const navigate = useNavigate();
    const handleReturn = () => {
        navigate('/');
    }
    return (
        <section className="page_404 d-flex align-items-center" style={{ height: '100vh' }}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 m-auto  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Look like you're lost
                                </h3>

                                <p>the page you are looking for not avaible!</p>

                                <div className="link_404" onClick={handleReturn} >Go to Sign in</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotFound
