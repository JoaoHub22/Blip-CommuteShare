import 'bootstrap/dist/css/bootstrap.css';

import NavBar from './components/navbar.tsx';
import imagePath from './assets/your_image_icon.png';

function App() {
    const items = ['Home', 'Product', 'Service'];

    return (
        <div>
            <NavBar brandName="CommuteShare" imageSrcPath={imagePath} navItems={items} />
        </div>
    );
}
export default App;
