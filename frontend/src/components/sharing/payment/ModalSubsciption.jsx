import { UserOutlined } from "@ant-design/icons";
import { Input, Modal, message } from "antd";
import { useContext, useState } from "react";
import CardInput from "./CardInput";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getLatestUserSubscription } from "src/_api/pricing";
import { selectPricingId, setSubscriptions } from "src/redux/services/subscription";
import { useDispatch, useSelector } from "react-redux";
import { api } from "src/_api";
import { createSubscriptionApi, updateSubscriptionMethodApi } from "src/_api/stripe";
import { newAbortSignal } from "src/lib/utils/abortController";
import { AuthContext } from "src/lib/context/authContext";
import { getMeApi } from "src/_api/auth";

export function ModalSubscription({
    isModalOpen, setIsModalOpen,
    showSubscriptionButton, showLogOutButton, initSumbit, updatePaymentMethod, modalView

}) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const priceId = useSelector(selectPricingId);
    const [initChangeSubscription, setInitChangeSubscription] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { handleProfile, profile } = useContext(AuthContext)
    const [cardName, setCardName] = useState('');

    const handleSubmitSubscription = async () => {
        setLoading(true)
        setInitChangeSubscription(true);
        handleSubmit();
    }

    const subscriptionChanged = (success, result) => {
        setLoading(false)
        setInitChangeSubscription(false);
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setLoading(false)
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!stripe || !elements) {
                setLoading(false)
                return;
            } else {
                const result = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email,
                    }
                });

                if (result.error) {
                    setLoading(false);
                    return;
                }

                if (!updatePaymentMethod) {
                    const body = {
                        paymentMethodId: result?.paymentMethod.id,
                        priceId,
                        cardEmail: email,
                        cardName,
                    }
                    const response = await createSubscriptionApi(body);
                    if (response) {
                        const [_, signal ]  = newAbortSignal();
                        getMeApi({
                            signal
                        })
                            .then(res => {
                                console.log({ res })
                                handleProfile(res.data)
                            })
                            .catch(()=> {
                            });
                        message.success("Subscription Created Succcessfully")
                    }
                    else {
                        message.warning("Something went wrong")
                    }
                } else {
                    const body = {
                        paymentMethodId: result?.paymentMethod.id,
                        cardEmail: email,
                        cardName,
                    }
                    console.log({ body })
                    const response = await updateSubscriptionMethodApi(body)
                    if (response) {
                        message.success("Payment Method Updated Successfully")
                    } else {
                        message.error("Something went wrong")
                    }
                }
            }
        } catch (err) {
            message.warning("Something went wrong")
        }
        finally {
            setLoading(false);
        }
    }

    const handleInputChange = (input) => {
        switch (input.target.name) {
            case 'cardEmail':
                setEmail(input.target.value)
                break;
            case 'cardName':
                setCardName(input.target.value)
                break;
            default:
                break;
        }
    }

    return (
        <Modal title="Subscription Payment" open={isModalOpen} okText="Subscribe"
            onOk={handleSubmitSubscription} onCancel={handleCancel} confirmLoading={loading}>
            <br />
            <Input
                placeholder='Enter Email Addresss'
                prefix={<UserOutlined />}
                name="cardEmail"
                defaultValue={email}
                onChange={handleInputChange}
            />
            <br />
            <br />
            <Input onChange={handleInputChange} name="cardName" placeholder='Name On Card' prefix={<UserOutlined />} />
            <br />
            <br />
            <div className="card_details">
                <CardInput />
            </div>
            <br />
        </Modal>
    )
}