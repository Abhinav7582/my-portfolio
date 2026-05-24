import { motion } from "framer-motion"

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-3">Get In Touch</p>
        <h2 className="text-4xl font-bold text-white mb-6">Contact Me</h2>
        <p className="text-gray-400 leading-relaxed mb-10">
          I'm always open to discussing data, analytics, new opportunities, or just a good conversation.
          Feel free to reach out through any of the channels below.
        </p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="mailto:abhisingh170801@gmail.com"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            ✉️ Send Email
          </a>
          <a
            href="https://www.linkedin.com/in/abhinav-singh-534012213/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-blue-400 px-8 py-3 rounded-full transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/Abhinav7582"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-blue-400 px-8 py-3 rounded-full transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-8 text-gray-600 text-sm">
          <p>Designed & built by Abhinav Singh · {new Date().getFullYear()}</p>
        </div>
      </motion.div>
    </section>
  )
}

export default Contact