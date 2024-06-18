/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
//@ts-nocheck

const Message = ({ notification }) => {
    return (
        <>
            <div id="notificationHeader">
                {/* image is optional */}
                {notification.image && (
                    <div id="imageContainer">
                        <img src={notification.image} width={100} />
                    </div>
                )}
                <span>{notification.title}</span>
            </div>
            <div id="notificationBody">{notification.body}</div>
        </>
    );
};

export default Message;
