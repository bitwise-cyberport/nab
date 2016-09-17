import React, { Component } from 'react'
import {createFetch, json, parseJSON, base, method, header} from 'http-client'
import { API_URL, PAYPAL_BASE_URL, PAYPAL_TOKEN } from '../constants/config'
import { connect } from 'react-redux'

class RedirectPage extends Component {

    componentDidMount() {
        const paymentId = this.props.location.query.paymentId
        const PayerID = this.props.location.query.PayerID;
        const userId = this.props.userId
        const sessionVars = window.name.split(";")
        console.log(sessionVars)
        const postTransaction = createFetch(
            base(API_URL),
            method("POST"),
            json({
                receiverId: sessionVars[0],
                receiverPassword: sessionVars[1],
                userId,
                paymentId,
                amount: sessionVars[2]
            }),
            parseJSON()
        )
        postTransaction("/api/transaction").then(resp => {
            console.log(resp.jsonData)
        })
        const executePayment = createFetch(
            base(PAYPAL_BASE_URL),
            method("POST"),
            header("Authorization", "Bearer " + PAYPAL_TOKEN),
            json({
                payer_id: PayerID
            }),
            parseJSON()
        )
        executePayment("/v1/payments/payment/" + paymentId + "/execute").then(resp => {
            console.log(resp.jsonData)
        })
    }

    render() {
        return (
            <h1>Transaction has been processed</h1>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.main.userId
    }
}

export default connect(mapStateToProps)(RedirectPage)