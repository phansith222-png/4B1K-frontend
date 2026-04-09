import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const Home = () => {
  return (
    <MainLayout>
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold mb-4">Welcome to Home</h1>
        <Button label="Click Me" onClick={() => alert('Hello!')} />
      </motion.div>
    </MainLayout>
  );
};

export default Home;