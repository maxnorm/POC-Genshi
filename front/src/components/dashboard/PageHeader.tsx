/**
 * PageHeader component
 * This component is used to display the page header
 * @param {Object} props - The props for the PageHeader component
 * @param {string} props.title - The title of the page
 * @param {string} props.description - The description of the page
 * @returns {Object} The PageHeader component
 */
function PageHeader({ title, description }: { title: string, description: string }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-genshi-blue-secondary">{title}</h2>
      <p>
        {description}
      </p>
    </div>
  );
} 

export default PageHeader;