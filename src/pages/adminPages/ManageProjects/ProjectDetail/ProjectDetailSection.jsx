function ProjectDetailSection({ icon, title, content }) {
    return (
      <div className="flex flex-col rounded-xl border border-[#CFDBEF] p-5 gap-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="text-gray-700">
          {content}
        </div>
      </div>
    )
  }
  
  export default ProjectDetailSection