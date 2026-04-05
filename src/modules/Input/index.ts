export { default as Dropdown } from './Dropdown.vue'
export { default as FileUpload } from './FileUpload.vue'

export interface DropdownOption<T> {
    key: T
    label: string
}
