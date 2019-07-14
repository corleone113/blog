import React, { PureComponent } from 'react';
import style from './style.css';
import { Carousel } from 'antd';
export default class Banner extends PureComponent {
    // constructor() {
    //     super()
    // }
    renderImage = (paths, size) => {
        return paths.map((item, index) => (<div key={index} className={style.carouselImgContainer}>
            <img src={item} style={{...size}} />
        </div>)
        );
    }
    render() {
        return (
            <Carousel autoplay>
                {this.renderImage(this.props.imagePaths, this.props.size)}
            </Carousel>
        )
    }
}