import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="text-center">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          {service.icon}
        </motion.div>

        {/* Service Name */}
        <h3 className="text-xl font-bold mb-2 text-dark">{service.name}</h3>

        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-3">
          Rp {service.price.toLocaleString('id-ID')}/{service.unit}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>

        {/* Category Badge */}
        <span className="inline-block bg-light px-3 py-1 rounded-full text-xs text-primary font-medium mb-4">
          {service.category}
        </span>

        {/* CTA Button */}
        <Link
          to="/order"
          className="inline-block btn-secondary text-sm py-2 px-4"
        >
          Pesan Sekarang
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
