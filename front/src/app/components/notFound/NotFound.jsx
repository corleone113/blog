import React, { Component } from 'react';
import style from './style.css';
import anim from '../../../static/animate.css';
import _404 from './404.png';

export default class extends Component {
    constructor() {
        super();
        this.state = {
            animationType: 'swing'
        }
    }
    enter = () => {
        this.setState({
            animationType: 'hinge'
        });
        setTimeout(() => {
            this.setState({
                animationType: 'lightSpeedIn'
            })
        }, 5000);
    }
    render() {
        return (
            <div className={style.container}>
                <img src={_404} className={`${anim.animated} ${anim[this.state.animationType]}`} onMouseEnter={this.enter} />
            </div>
        )
    }
}