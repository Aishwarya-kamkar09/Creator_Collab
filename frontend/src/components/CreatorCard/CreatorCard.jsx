
function CreatorCard({ creator }) {

    const {
        name,
        cat,
        price,
        tag,
        tags,
        lock,
        g1,
        g2
    } = creator;


    // Generate a fallback initial from the creator name
    const parts = name.split(" ");

    const initials = (
        parts[0][0] +
        (parts[1] ? parts[1][0] : "")
    ).toUpperCase();


    // Same image source used in your original HTML/JS
    const photoUrl = `https://loremflickr.com/600/750/${tags}?lock=${lock}`;


    return (
        <div className="creator-card">

            <div
                className="creator-photo"
                style={{
                    background: `linear-gradient(150deg, ${g1}, ${g2})`
                }}
            >

                {/* Fallback initials */}
                <span className="fallback-initials">
                    {initials}
                </span>


                {/* Creator image */}
                <img
                    src={photoUrl}
                    alt={`${cat} content example`}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />


                {/* Followers */}
                <span className="tag-badge">
                    📷 {tag}
                </span>

            </div>


            <div className="creator-info">

                <div className="name">
                    {name}
                </div>

                <div className="cat">
                    {cat}
                </div>

                <div className="price">
                    {price} / post
                </div>

            </div>

        </div>
    );
}

export default CreatorCard;

