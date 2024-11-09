export const TextLoading = (props) => {
    return (
        <div
            class={`h-[${props.height}] animate-pulse bg-${props.backgroundColor}-${props.backgroundValue} rounded-${props.roundValue} w-[${props.width}] m-[${props.marginValue}]`}
        >Loading</div>
    );
};



export const ImageLoading = () => {
    return 
}