import React from 'react'

function ProfileCard({ img, name, count }) {
    return (
        <div className="py-2">
            <div className="row">
                <div className="col-12">
                    <div className="card" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-2">
                            <div className="d-flex text-black">
                                <div className="flex-shrink-0">
                                    <img src={img}
                                        alt="Generic placeholder"
                                        style={{ width: '40px', borderRadius: ' 10px' }} />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1">{name}</h5>
                                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                                        style={{ backgroundColor: '#efefef' }}>
                                        <div >
                                            <p className="small text-muted mb-1">Number of Invite</p>
                                            <p className="mb-0">{count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
