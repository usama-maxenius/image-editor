import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function BubbleContent(){

    return(
        <>
    <h3>Articles Images</h3>

        <div style={{display:'flex',justifyContent: 'space-around', flexWrap:'wrap',rowGap:'10px' }}>
    <img width='90' height='90' src='https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2020_34/3405737/200819-putin-trump-mc-1257.JPG' alt="" style={{border:'2px #9575bf solid'}}/>
    </div>

    <h3>AI Images</h3>

    <div style={{display:'flex',justifyContent: 'space-around', flexWrap:'wrap',rowGap:'10px' }}>
    
    <img width='90' height='90' src='' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='' alt="" style={{border:'2px #9575bf solid'}}/>
    <img width='90' height='90' src='' alt="" style={{border:'2px #9575bf solid'}}/>
    </div>

        <br />
        <div style={{ display: 'flex', justifyContent : 'center'}}>
    <label style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
    <h5 style={{ margin: '6px'}}>IMAGE UPLOAD</h5>
  <input type="file" style={{display:'none'}}/>
<CloudUploadIcon style={{fontSize:'40px'}}/>
</label>
</div>

        </>
    )
}

export default BubbleContent