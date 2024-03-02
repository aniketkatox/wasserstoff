export const CategoryPane = ({ categoryPaneProp }) => {
    const setSelectedCategory = categoryPaneProp.setSelectedCategory;
    
    return (
        <div id="category-pane">
            <button onClick={() => setSelectedCategory('all')}><pre> All </pre></button>
            <button onClick={() => setSelectedCategory('education')}><pre> Education </pre></button>
            <button onClick={() => setSelectedCategory('business')}><pre> Business </pre></button>
            <button onClick={() => setSelectedCategory('technology')}><pre> Technology </pre></button>
        </div>
    )
}